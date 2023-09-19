import PocketBase from "pocketbase";

const pb = new PocketBase("https://lahuman.fly.dev");
pb.autoCancellation(false);

export default pb;
