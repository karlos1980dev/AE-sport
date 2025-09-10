import mercadopago from "mercadopago";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    mercadopago.configure({
      access_token: process.env.MP_ACCESS_TOKEN,
    });

    const { title, price, userId } = req.body;

    const preference = {
      items: [
        {
          title: title || "Compra de créditos",
          unit_price: Number(price) || 5.0,
          quantity: 1,
        },
      ],
      back_urls: {
        success: "https://achouganhou.netlify.app/sucesso.html",
        failure: "https://achouganhou.netlify.app/falha.html",
        pending: "https://achouganhou.netlify.app/pendente.html",
      },
      auto_return: "approved",
      notification_url: `https://achouganhou-backend.vercel.app/api/webhook?userId=${userId}`,
    };

    const response = await mercadopago.preferences.create(preference);
    res.status(200).json({ id: response.body.id });
  } catch (error) {
    console.error("Erro Mercado Pago:", error);
    res.status(500).json({ error: "Erro ao criar preferência" });
  }
}