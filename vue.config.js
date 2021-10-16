module.exports = {
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/django-vue-invoice-app-frontend/"
      : "/",
};
