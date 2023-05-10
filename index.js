import SpacePunksTokenABI from "./space_punks_token.js"

document.addEventListener("DOMContentLoaded", () => {
  const web3 = new Web3(window.ethereum)

  document.getElementById("load_button").addEventListener("click", async () => {
    const contract = new web3.eth.Contract(SpacePunksTokenABI, "0x63bEA2310A9B427b48D22526EBEa50C5464Af90D")
    const walletAddress = document.getElementById("wallet_address").value
    contract.defaultAccount = walletAddress
    const spacePunksBalance = await contract.methods.balanceOf(walletAddress).call()
    
    document.getElementById("nfts").innerHTML = ""

    for(let i = 0; i < spacePunksBalance; i++) {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(walletAddress, i).call()

      let tokenMetadataURI = await contract.methods.tokenURI(tokenId).call()

      if (tokenMetadataURI.startsWith("ipfs://")) {
        tokenMetadataURI = `https://ipfs.io/ipfs/${tokenMetadataURI.split("ipfs://")[1]}`
      }

      

      const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json())
      let image = `https://ipfs.io/ipfs/${tokenMetadata["image"].split("ipfs://")[1]}`

      const spacePunkTokenElement = document.getElementById("nft_template").content.cloneNode(true)
      spacePunkTokenElement.querySelector("h1").innerText = tokenMetadata["name"]
      spacePunkTokenElement.querySelector("img").src = image
      spacePunkTokenElement.querySelector("img").alt = tokenMetadata["description"]

      document.getElementById("nfts").append(spacePunkTokenElement)
    }
  })
})