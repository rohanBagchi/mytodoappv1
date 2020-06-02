const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const data = JSON.parse(event.body)
  const { user } = data

  const responseBody = {
    user_metadata: {
      ...user.user_metadata
    }
  }

  const requestBodyString = JSON.stringify({
    query: `
    mutation insertUser($id: String, $email:String, $name:String){
      insert_users(objects: {id: $id, email: $email, name: $name}) {
        affected_rows
      }
    }    
  `,
    variables: {
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name
    }
  });

  const result = await fetch(
    "https://hasura-app-with-netlify.herokuapp.com/v1/graphql",
    {
      method: "POST",
      body: requestBodyString,
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret":
          process.env.HASURA_SECRET
      }
    }
  );
  const { errors, dataFromHasura } = await result.json();

  if (errors) {
    console.log(errors);
    return {
      statusCode: 500,
      body: "Something is wrong"
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({...responseBody, ...dataFromHasura})
    };
  }
}
