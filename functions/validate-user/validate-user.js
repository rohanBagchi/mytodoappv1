exports.handler = async (event, context) => {
  const {
    user
  } = context.clientContext;
  if (user) {
    const userID = user.sub;
    console.log("user ==> ", user)
    console.log("response to hasura ==> ", {
      "X-Hasura-User-Id": userID,
      "X-Hasura-Role": "user",
    })
    return {
      statusCode: 200,
      body: JSON.stringify({
        "X-Hasura-User-Id": userID,
        "X-Hasura-Role": "user",
      })
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      "X-Hasura-role": "anonymous"
    })
  };
};