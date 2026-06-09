import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadCampaignProof(campaignId: string, file: File) {
  // 1. Upload to Storage
  const filePath = `${campaignId}/${Date.now()}_${file.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('proofs')
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  // 2. Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from('proofs')
    .getPublicUrl(filePath)

  const publicUrl = publicUrlData.publicUrl

  // 3. Insert into campaign_proofs
  const { error: insertError } = await supabase
    .from('campaign_proofs')
    .insert([{ campaign_id: campaignId, proof_url: publicUrl }])

  if (insertError) {
    throw new Error(`Database insert failed: ${insertError.message}`)
  }

  // 4. Update campaigns table
  const { error: updateError } = await supabase
    .from('campaigns')
    .update({ status: 'Posted' })
    .eq('id', campaignId)

  if (updateError) {
    throw new Error(`Status update failed: ${updateError.message}`)
  }

  return { success: true, publicUrl }
}
