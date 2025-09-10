import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  try {
    const { payment_id, collection_id } = req.query;
    const id = collection_id || payment_id;
    if (!id) return res.status(400).json({ error: "payment_id obrigatório" });

    const resp = await mercadopago.payment.get(id);
    res.status(200).json({ status: resp.body.status, id: resp.body.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}