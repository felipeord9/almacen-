import { config } from "../config";

const url = `${config.apiUrl}/products`;

function getAllProducts() {
  return fetch(url)
    .then((res) => res.json())
    .then((res) => res.data);
}

function getOneProduct(id) {
  return fetch(`${url}/${id}`)
    .then((res) => res.json())
    .then((res) => res.data);
}

function createProduct(data) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => res.data);
}

function updateProduct(id, data) {
  return fetch(`${url}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => res.data);
}

function deleteProduct(id) {
  return fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => res.data);
}

export {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
