export default defineEventHandler(async(event) => {
    const body = await readBody(event); 
        return {
            body: body,
            title: "News Org 1",
            slug: "taisounds",
            website: "https://www.taisounds.com.tw",
            description: "",
            facebook: "https://www.facebook.com/taisounds",
        }
})

    