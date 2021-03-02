FROM node:6.10-alpine
MAINTAINER Ralstan Vaz

ADD src /home/code/
ADD etc /etc
ADD ssh /root/.ssh

WORKDIR /home/code
#RUN yum clean all && yum -y -q install make gcc-c++
RUN npm install --production

CMD [ "npm", "start" ]

EXPOSE 80

#ENTRYPOINT /usr/bin/supervisord /home/code node
