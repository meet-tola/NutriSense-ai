'use server';
import { createServerClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { revalidatePath } from 'next/cache';
import { ScanOutput } from './analyze-food'; // Reuse from previous
import { Profile } from '@/types/database';

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: 'https://api.deepseek.com/v3.2_speciale_expires_on_20251215',
});

export type UserConditions = {
  hasDiabetes: boolean;
  hypertension: boolean;
  ulcer: boolean;
  weight_loss: boolean;
};

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export async function getOrCreateConversation(userId: string): Promise<string> {
  const supabase = await createServerClient();
 
  // Check for existing conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_id', userId)
    .single();
  if (existing) {
    return existing.id;
  }
  // Create new conversation
  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: userId })
    .select('id')
    .single();
  if (error) {
    console.error('Error creating conversation:', error);
    throw new Error('Failed to create conversation');
  }
  return data.id;
}

export async function getConversationMessages(conversationId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data;
}

export async function sendUserMessage(
  userId: string,
  content: string,
  imageUrl?: string
): Promise<{ conversationId: string; assistantResponse: string }> {
  const supabase = await createServerClient();
  const conversationId = await getOrCreateConversation(userId);
  // Insert user message
  const { error: insertError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role: 'user',
      content,
      image_url: imageUrl || null,
    });
  if (insertError) {
    console.error('Error inserting user message:', insertError);
    throw new Error('Failed to send message');
  }
  // Generate assistant response (general chat)
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('Profile not found');
  }
  const userConditions: UserConditions = {
    hasDiabetes: profile.has_diabetes,
    hypertension: profile.health_conditions?.includes('hypertension') || false,
    ulcer: profile.health_conditions?.includes('ulcer') || false,
    weight_loss: profile.primary_goal === 'weight_loss' || (profile.secondary_goals || []).includes('weight_loss'),
  };
  const model = 'deepseek-v3.2-speciale';
  const systemPrompt = `You are an empathetic diabetes health assistant. Respond conversationally to user queries about nutrition, diabetes management, meals, etc. Personalize based on user conditions: diabetes (low-GI, portion control), hypertension (low-sodium), ulcer (bland), weight loss (calorie control). Keep positive, under 200 words, use markdown. End with a question.`;
  // For general chat, fetch recent messages for context
  const recentMessages = await getConversationMessages(conversationId);
  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...recentMessages.slice(-5).map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })),
    { role: 'user' as const, content: `${content}\n\nUser Conditions: ${JSON.stringify(userConditions)}` },
  ];
  const completion = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: 800,
  });
  const assistantResponse = completion.choices[0]?.message?.content || '';
  // Insert assistant response
  const { error: assistantError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: assistantResponse,
    });
  if (assistantError) {
    console.error('Error inserting assistant message:', assistantError);
    throw new Error('Failed to generate response');
  }
  revalidatePath('/dashboard'); // Revalidate for client fetch
  return { conversationId, assistantResponse };
}

export async function sendFoodAnalysisMessage(
  userId: string,
  userPrompt: string,
  scanOutput: ScanOutput,
  imageUrl?: string // If stored in Supabase Storage
): Promise<{ conversationId: string; assistantResponse: string }> {
  // Reuse logic from analyzeFood, but integrate with chat
  const conversationId = await getOrCreateConversation(userId);
  // Insert user message with prompt and image
  const supabase = await createServerClient();
  const { error: insertError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role: 'user',
      content: `${userPrompt} [Food Image Attached]`,
      image_url: imageUrl || null,
    });
  if (insertError) {
    console.error('Error inserting analysis user message:', insertError);
    throw new Error('Failed to send analysis');
  }
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('Profile not found');
  }
  const userConditions: UserConditions = {
    hasDiabetes: profile.has_diabetes,
    hypertension: profile.health_conditions?.includes('hypertension') || false,
    ulcer: profile.health_conditions?.includes('ulcer') || false,
    weight_loss: profile.primary_goal === 'weight_loss' || (profile.secondary_goals || []).includes('weight_loss'),
  };
  // Generate AI response (from previous analyzeFood logic)
  const model = 'deepseek-v3.2-speciale';
  const systemPrompt = `You are an empathetic diabetes health assistant. Generate a helpful, conversational response based on the food scan output. Focus on diabetes management if the user has diabetes (emphasize low-GI foods, portion control, balanced macros). Consider other conditions like hypertension (low-sodium suggestions), ulcers (bland foods), weight loss (calorie control). Structure the response with:
- **Identified Foods**: List detected items with confidence.
- **Nutritional Breakdown**: Key macros, calories, GI.
- **Health Impact**: Personalized analysis based on conditions.
- **Recommendations**: Actionable tips, alternatives.
Keep it positive, encouraging, under 300 words. Use markdown for formatting (bold, bullets). End with a question to continue the conversation.`;
  const userContent = `Scan Output: ${JSON.stringify(scanOutput, null, 2)}\n\nUser Prompt: ${userPrompt}\n\nUser Conditions: ${JSON.stringify(userConditions)}`;
  const messages = [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user' as const, content: userContent },
  ];
  const completion = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: 1500,
  });
  const assistantResponse = completion.choices[0]?.message?.content || '';
  // Insert assistant response
  const { error: assistantError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: assistantResponse,
    });
  if (assistantError) {
    console.error('Error inserting analysis assistant message:', assistantError);
    throw new Error('Failed to generate analysis response');
  }
  revalidatePath('/dashboard');
  return { conversationId, assistantResponse };
}