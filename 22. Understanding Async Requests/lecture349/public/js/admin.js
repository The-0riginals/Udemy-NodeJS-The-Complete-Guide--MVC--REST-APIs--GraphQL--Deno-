const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const productElement = btn.closest('article');
  //closest() is used to find the closest ancestor element that matches the selector

  //this is a DELETE request so we're not sending any data (i.e. a request body) to the server. We're simply telling the API to delete the resource with that specific ID.
  //manipulating the DOM is not the best way to handle this. We should instead send a request to the server and then update the DOM based on the response we get back from the server.
  fetch(`/admin/product/${prodId}`, {//fetch() is a browser API that allows us to send http requests via javascript
    method: 'DELETE',
    headers: {
      'csrf-token': csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);//this will remove the product from the DOM
    })
    .catch((err) => {
      console.log(err);
    });
};

