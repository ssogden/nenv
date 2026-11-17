# Blue/Green Deployment with Nginx

This project demonstrates a Blue/Green deployment with auto-failover and manual toggling using Nginx and Docker Compose.

It's designed to run two identical application containers (blue and green) behind an Nginx reverse proxy. Nginx handles routing 100% of traffic to the primary pool and automatically failing over to the backup pool if the primary becomes unhealthy.

## File Structure

-   `docker-compose.yml`: Orchestrates the `nginx`, `app_blue`, and `app_green` services.
-   `nginx/nginx.conf.template`: Nginx config template. Variables (`${...}`) are injected by the init script.
-   `nginx/nginx-init.sh`: The script that runs in the Nginx container to generate the final config from the template.
-   `.env.example`: Provides example environment variables.
-   `README.md`: This file.

## How to Run

These instructions assume you are running on a remote cloud server (e.g., AWS EC2).

1.  **SSH into the Cloud Server and Clone the Repository**
    ```sh
    ssh -i ~/.ssh/[your-key-pair] username@[YOUR-IP-ADDRESS/HOSTNAME]
    git clone git@github.com:ssogden/nenv.git
    cd your-repo-name
    ```

2.  **Install Git, Docker, and Docker Compose**
    You must have Docker and Docker Compose installed. On modern Linux systems, this is often installed as a Docker plugin.
    * Follow the [official Docker install instructions](https://docs.docker.com/engine/install/) for your Linux distribution.
    * Ensure you install the `docker-compose-plugin` (or `docker compose`).
    * Add your user to the `docker` group to avoid using `sudo` for every command:
        ```sh
        sudo usermod -aG docker $USER
        ```
    * **Important:** You must log out and log back in for this change to take effect.

3.  **Prepare Environment File**
    Copy the example `.env` file. You **must** edit this file to add your container image URLs for `BLUE_IMAGE` and `GREEN_IMAGE`.

    ```sh
    cp .env.example .env
    nano .env
    ```

4.  **Make Init Script Executable**
    The `nginx-init.sh` script must have execute permissions to run inside the container.

    ```sh
    chmod +x ./nginx/nginx-init.sh
    ```

5.  **Start Services**
    Run Docker Compose in detached (`-d`) mode. (Use `sudo` if you skipped step 1).

    ```sh
    docker compose up -d
    ```

## How to Test

These tests should be run from your **local computer's terminal**, *not* from inside the cloud server.

### **Firewall Prerequisite**
Before you can test, you must **open ports** in your cloud provider's firewall (e.g., AWS Security Group, GCP Firewall).

You need to allow inbound TCP traffic on the following ports:
* `8000` (for the Nginx proxy)
* `8081` (for the Blue app's chaos endpoint)
* `8082` (for the Green app's chaos endpoint)

### **Setup**
Find your server's **Public IP Address** and use it in place of `[YOUR_SERVER_IP]` in all the commands below.

---

### 1. Test Baseline (Blue Active)

**Setup:** Ensure `ACTIVE_POOL=blue` in your `.env` file on the server and run `docker compose up -d`.

**Action:** Send a request to the Nginx proxy from your local machine.

```sh
curl -i http://[YOUR_SERVER_IP]:8000/release
```
**Expected Output:** You should see a `200 OK` response, and the headers will include `X-App-Pool: blue`.

---

### 2. Test Manual Toggle (Blue -&gt; Green)

1.  **Stop the services (on the server):**
    ```sh
    # SSH into your server
    docker compose down
    ```

2.  **Edit `.env` file (on the server):**
    Change `ACTIVE_POOL=blue` to `ACTIVE_POOL=green`.
    ```sh
    nano .env
    ```

3.  **Start services (on the server):**
    ```sh
    docker compose up -d
    ```

4.  **Test the proxy (from your local machine):**
    ```sh
    curl -i http://[YOUR_SERVER_IP]:8000/version
    ```
**Expected Output:** All traffic should now go directly to Green (`X-App-Pool: green`), and Blue (`X-App-Pool: blue`) will now be serving as the backup.

---

### Additional Note

I included a Bash `test-script` file you can use to test the setup after installing the needed tools and setting everything up.