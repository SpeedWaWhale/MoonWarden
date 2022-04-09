var ProxyTax = artifacts.require("ProxyTax");

module.exports = function(deployer) {
  deployer.deploy(ProxyTax, "0xdf6D6Aba480A436f0bA70d312b77433b9D3D4De1", "0x614E75A224Cee47838801803024FF0F16910cb9e", "0xb26f0712AE19C6E9E65eB6f32C0971A13b7DA179", 10);
};