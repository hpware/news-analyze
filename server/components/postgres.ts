import { SQL } from "bun";

const postgres = new SQL({
    url: process.env.POSTGRES_URL,
})

export default postgres;