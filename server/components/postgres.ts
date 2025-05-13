import SQL from "postgres";

const postgres = SQL(`${process.env.POSTGRES_URL || ""}`);

export default postgres;
