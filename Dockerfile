FROM arablocks/ann
WORKDIR /opt/dns/
ADD . /opt/dns/
ENTRYPOINT [ "ann",  "-t", "." ]
