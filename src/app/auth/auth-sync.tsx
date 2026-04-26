import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@/shared/lib/supabase/server'

export async function AuthSync() {
  const { userId } = await auth()
  if (!userId) return null

  try {
    const user = await currentUser()
    if (!user) return null

    const email = user.emailAddresses[0]?.emailAddress
    if (!email) {
      console.error('❌ User has no email address, skipping sync:', userId)
      return null
    }

    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()

    const supabase = createClient()

    // Buscamos si el usuario ya existe por email
    const { data: existingUser } = await supabase
      .from('User')
      .select('id, clerkId')
      .eq('email', email)
      .single()

    if (existingUser && existingUser.clerkId !== userId) {
      // Actualizamos el clerkId si es diferente
      await supabase
        .from('User')
        .update({
          clerkId: userId,
          name: fullName,
          image: user.imageUrl,
          updatedAt: new Date().toISOString(),
        })
        .eq('email', email)
    } else {
      // Upsert basado en clerkId
      await supabase.from('User').upsert(
        {
          id: crypto.randomUUID(),
          clerkId: userId,
          email,
          name: fullName,
          image: user.imageUrl,
          updatedAt: new Date().toISOString(),
        },
        { onConflict: 'clerkId' }
      )
    }
  } catch (error) {
    console.error('❌ Error syncing user to Supabase:', error)
  }

  return null
}
