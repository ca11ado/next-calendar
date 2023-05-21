export const getItems = async () => {
  try {
    const url = `${process.env.EDGE_API_URL}/${process.env.EDGE_CONFIG_ID}/items`;
    const readItems = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.EDGE_API_TOKEN}`,
      },
    });
    return await readItems.json();
  } catch (error) {
    console.log("get items error", error);
  }
};
