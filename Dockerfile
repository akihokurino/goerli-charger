FROM public.ecr.aws/lambda/nodejs:16
RUN yum -y install \
  libX11 \
  libXcomposite \
  libXcursor \
  libXdamage \
  libXext \
  libXi \
  libXtst \
  cups-libs \
  libXScrnSaver \
  libXrandr \
  alsa-lib \
  pango \
  atk \
  at-spi2-atk \
  gtk3 \
  google-noto-sans-japanese-fonts
COPY build/index.js package*.json ./
RUN npm install
CMD ["index.handler"]