import stripe from 'stripe'

const client = new stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2020-08-27',
})

export const Stripe = {
  connect: async (code: string) => {
    const response = await client.oauth.token({
      grant_type: 'authorization_code',
      code,
    })
    if (!response) throw new Error('Failed to connect with stripe!')

    return response
  },
}
