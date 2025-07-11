import { createClient } from '@supabase/supabase-js'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const bucket = 'payload-uploads'

export const supabaseAdapter = (): Adapter => ({
  async handleUpload({ filename, buffer }) {
    const { error } = await supabase.storage.from(bucket).upload(filename, buffer, {
      upsert: true,
      contentType: 'image/jpeg',
    })

    if (error) throw new Error(error.message)

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename)

    return {
      filename,
      url: data.publicUrl,
    }
  },

  async handleDelete(filename) {
    const { error } = await supabase.storage.from(bucket).remove([filename])
    if (error) throw new Error(error.message)
  },
})
