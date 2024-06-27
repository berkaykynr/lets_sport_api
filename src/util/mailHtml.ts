export function htmlFunc(code: string) {
  return `

  <style>
    body {
      width: 50%;
      height: 50%;
      background-color: #e87f02;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    a {
      color: black;
    }
    .image {
      display: flex;
      align-items: center;
      width: 40%;
      object-fit: contain;
    }
  </style>
  <body>
    <img class="image" src="splash.png" alt="Let's sport logo siyah" />
    <a>Reset password code:${code} </a>
  </body>

    `;
}
