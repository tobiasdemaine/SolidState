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
docker run -d --restart always --expose=8080 -e VIRTUAL_PORT=8080 -e VIRTUAL_HOST=ipfs.tobiasdemaine.com --name ipfs_host -v /path_to/ipfs_storage/staging/:/export -v /path_to/ipfs_storage/data/:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/go-ipfs:latest
```

Setup Ipfs API
---------------
```text
docker build -t solidstateapi .
```

```text
docker run -d --restart always --expose=3030 -e VIRTUAL_PORT=3030 -e VIRTUAL_HOST=solidstate.tobiasdemaine.com --name solidstate -v /var/run/docker.sock:/var/run/docker.sock -p 127.0.0.1:3030:3030 solidstateapi:latest
```


Setup nGinx reverse proxy
-------------------------
make sure your SSL certificates are in the ssl volume directory with the same name as the vitual host. 

eg : api.tobiasdemaine.com.crt, api.tobiasdemaine.com.key


```text
docker pull jwilder/nginx-proxy
```
then
```text
docker run -d -p 80:80 -p 443:443 -v /path_to_ssl/ssl:/etc/nginx/certs -v /root/my_proxy.conf:/etc/nginx/conf.d/my_proxy.conf:ro -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy
```


Upload a file
-------------
Supported Types (jpg|jpeg|png|gif|mp4|pdf)

Step 1. Request a Session key. 

Endpoint /k
Post Params :
```text
    {
        secret: false,
    }
```
returns :
```text
    {
        key : uuid
    }
```


Step 2. Upload a file 

Endpoint : /f

Post Params :
```text
    {
        file : file_upload,
        key : uuid,
        publish: false,
    }
```

returns :
```text
    {
        ipfsHash : hash
    }
```

Step 3. Upload uuid.json and publish 

Endpoint : /f

Post Params :
```text
    {
        data : JSON.stringify,
        key : uuid,
        publish: true,
    }
```

returns :
```text
    {
        contractHash : "Processing"
    }
```

Step 4. Poll until contract is deployed and added to gallery

Endpoint : /r

Post Params :
```text
    {
        key : uuid,
       
    }
```

returns :
```text
    {
        ready : false || 0xContractHash
    }
```