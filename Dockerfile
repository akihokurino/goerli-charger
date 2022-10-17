FROM public.ecr.aws/lambda/nodejs:16
RUN yum install -y https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
RUN npm install -g puppeteer-core puppeteer
COPY build/index.js node_modules ./
CMD ["index.handler"]