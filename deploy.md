# Deploying via Docker compose
### Prerequisites
NOTE: This guide only has Ubuntu / Debian way of doing things, if you are using other distros, please ignore the prerequisites.
1. Install Docker & Docker Compose via the docker deb registry. (DON'T USE THE NATIVE docker compose, as it won't work.)
You can check out the offical docs [here](https://docs.docker.com/engine/install/debian/)
2. Run this to install the offical docker source:
```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```
3. Run this to install docker & docker compose:
```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
4. Download the docker-compose.yml and .env.example file to an dir & change the .env.example file to .env:
```bash
# Chahnge your_dir to your dir in your server!
mkdir ./your_dir
cd ./your_dir
curl -O https://raw.githubusercontent.com/hpware/news-analyze/refs/heads/master/docker-compose.yml
curl -O https://raw.githubusercontent.com/hpware/news-analyze/refs/heads/master/.env.example
mv .env.example .env
```
5. Get Postgres on your server or via a docker container, this compose file doesn't have postgres in there, as my prod server already has a postgresql db, if you don't please just ask, I can maybe help (or just use the basic docker image on the docker hub.)
6. Pull down the image & if you are using a proxy, enter 127.0.0.1:36694 into the proxy forward route, and update the docker compose to your own domain, (yes a domain is required), if you are in hackclub (under 18), using their nest cloud service, you can get a domain like your_account.hackclub.app :D
```bash
docker compose pull
```
7. After doing changes. you can run these commands:
```bash
docker compose up -d
```
NOTE: By shutting down or just rebooting the server, will stop the app, you need to go to that directory, and luanch it via `docker compose up -d`, if you want to stop the app, you can run `docker compose down`

# For updates:
For updates, you can run the commands below:
```bash
docker compose down
docker compose pull
docker compose up -d
```
