### ▶ Preparation

- Replace `.env.sample` with `.env`
- Certificate / Domains

  - Generate `certs/cert.pem`, `certs/key.pem `
    - locally e.g. via [_mkcert_](https://github.com/FiloSottile/mkcert), which creates files and a local CA by:
      ```bash
      $ mkcert -install
      $ mkcert -cert-file certs/cert.pem -key-file certs/key.pem "docker.localhost" "*.docker.localhost"
      ```

### ▶ Build & Run

```bash
# create network
$ docker network create proxy
# build images
$ docker-compose build
# start containers
$ docker-compose up
```
