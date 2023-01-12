exports.slugify = (string) => {
  string = string || "";
  return string
    .replace(/ /g, "-")
    .replace(/[^\一-龠\ぁ-ゔ\ァ-ヴー\w\.\-]+/g, "");
};
