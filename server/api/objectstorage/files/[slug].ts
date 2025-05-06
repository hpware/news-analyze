import s3 from "~/server/components/s3";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  return sendRedirect(
    event,
    `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKETNAME}/${slug}`,
    302,
  );
});
