let ActiveUser = [];

exports.AddActiveUser = async ({ parent_id, user }) => {
  if (parent_id) {
    const { _id } = user;

    if (ActiveUser.length === 0) {
      ActiveUser.push({ parent_id, users: [{ ...user }] });
      console.log("if zero");
      return ActiveUser;
    }
    let ParentIdExist = await ActiveUser.filter(
      (data) => data.parent_id.toString() == parent_id.toString()
    );
    if (ParentIdExist.length == 0) {
      ActiveUser.push({ parent_id, users: [{ ...user }] });
      console.log("Parent Debugging");
      return ActiveUser;
    }
    await ActiveUser.forEach((data, index) => {
      if (data.parent_id.toString() === parent_id.toString()) {
        const userListExist = data.users.filter(
          (userList) => userList._id.toString() === _id.toString()
        );
        if (userListExist.length === 0) {
          ActiveUser[index].users.push(user);
        }
      }
    });
    console.log("Checking not null");
    return ActiveUser;
  }
};
exports.getActiveUser = async ({ parent_id }) => {
  const result = await ActiveUser.filter(
    (data) => data.parent_id.toString() == parent_id.toString()
  );
  if (result.length > 0) {
    return result[0];
  }
  return null;
};
exports.removeActiveUser = ({ parent_id, _id }) => {
  for (let i = 0; i < ActiveUser.length; i++) {
    if (ActiveUser[i].parent_id.toString() == parent_id.toString()) {
      ActiveUser[i].users = ActiveUser[i].users.filter(
        (data) => data._id.toString() !== _id.toString()
      );
    }
  }
  return ActiveUser;
};
