const saveToStorage = ({ storageType, key, data }) => {
  try {
    if (storageType !== "local" && storageType !== "session")
      throw new Error("storage type can only be local or session");

    if (storageType === "local") {
      localStorage.setItem(key, data);
      return;
    }

    if (storageType === "session") {
      sessionStorage.setItem(key, data);
      return;
    }
  } catch (error) {
    console.error(error);
  }
};

export default saveToStorage;
