let ActiveUser = [];

exports.AddActiveUser = async ( user ) => {
  if (user) {
    if (ActiveUser.length === 0) {
      ActiveUser.push(user);
     
      return;
    }
    let ifExist = false;
    await ActiveUser.forEach((data) => {
      if (data._id.toString() === user._id.toString()) {
        ifExist = true;
      }
    });
    if (!ifExist) {
      ActiveUser.push(user);
      return;
    }
  }
};
exports.getActiveUser =  () => {
  return ActiveUser;
};
exports.removeActiveUser =  (id) => {
  const filtered = ActiveUser.filter(
    (val) => val._id.toString() != id.toString()
  );
  ActiveUser = filtered;
  return ActiveUser;
};
