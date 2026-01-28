const baseUrl = "http://localhost:3000/api/todos";

const getItemsFromServer = async () => {
  const response = await fetch(baseUrl)
  return response.json()
}


const addItemToServer = async (text) => {  
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({text})
  })

  return await res.json()
  
}


const deleteItemFromServer = async (itemId) => {
  const response = await fetch(`${baseUrl}/${itemId}`, {
    method: "DELETE",
  })  
  return response.ok   
}

const updateItemFromServer = async ({id, text}) => {  
  
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({text})
  })

  return response.ok  
}

const toggleItemOnServer = async ({id, completed}) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({completed: !completed})
  })

  return response.ok
}

export {getItemsFromServer, addItemToServer, deleteItemFromServer, updateItemFromServer, toggleItemOnServer}