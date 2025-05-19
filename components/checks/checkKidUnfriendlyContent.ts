async function checkUnsafeContent() {
  const req = await fetch("/api/contentcheck/kidunfriendlycontent");
  const res = await req.json();
}

export default checkUnsafeContent;
