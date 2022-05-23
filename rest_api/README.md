SOLID STATE IPFS REST Api
=========================

Api for uploading a file to an ipfs server running in docker container on the same server.

Setup Ipfs Docker
-----------------
```text
docker pull ipfs/go-ipfs
```
then
```text
docker run -d --restart always --expose=8080 -e VIRTUAL_PORT=8080 -e VIRTUAL_HOST=ipfs.tobiasdemaine.com --name ipfs_host -v /home/studio/Development/SolidState/rest_api/ipfs_storage/staging/:/export -v /home/studio/Development/SolidState/rest_api/ipfs_storage/data/:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/go-ipfs:latest
```

Setup Ipfs API
---------------
```text
docker build -t solidstate/ipfsapi
```

```text
docker run -d --restart always --expose=3030 -e VIRTUAL_PORT=3030 -e VIRTUAL_HOST=ipfsapi.tobiasdemaine.com --name ipfs_api -v /var/run/docker.sock:/var/run/docker.sock -p 127.0.0.1:3030:3030 solidstate/ipfsapi:latest
```

Setup nGinx reverse proxy
-------------------------
make sure your SSL certificates are in the SLL volume directory with the same name as the vitual host. 

eg : ipfsapi.tobiasdemaine.com.crt, ipfsapi.tobiasdemaine.com.key


```text
docker pull jwilder/nginx-proxy
```
then
```text
docker run -d -p 80:80 -p 443:443 -v /path_to_ssl/ssl:/etc/nginx/certs -v /root/my_proxy.conf:/etc/nginx/conf.d/my_proxy.conf:ro -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy
```


Upload a file
-------------
(jpg|jpeg|png|gif|mp4|pdf)

1. request a key. /k
returns :
```text
    {
        key : uuid
    }
```

2. upload a file 
Post Params :
```text
    {
        file : file_upload
        key : uuid
    }
```

returns :
```text
    {
        ipfsHash : hash
    }
```