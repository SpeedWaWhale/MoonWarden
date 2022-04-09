// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ProxyTax {

  address private taxEditor;
  address private wallet1;
  address private wallet2;

  uint private tax;

  event Received(address, uint);
  event Tax(address w1, uint amount1, address w2, uint amount2, uint tax);

  constructor(address _taxEditor, address _wallet1, address _wallet2, uint _tax) {
        require(_tax > 0, "Tax can't must be superior to 0");
        taxEditor = _taxEditor;
        wallet1 = _wallet1;
        wallet2 = _wallet2;
        tax = _tax;
  }

  // Role

  modifier onlyTaxEditor() {
    require(msg.sender == taxEditor, "This can only be called by the tax editor!");
    _;
  }

  // Getters and setters

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function getTaxEditor() public view returns (address) {
    return taxEditor;
  }

  function getWallet1() public view returns (address) {
    return wallet1;
  }

  function getWallet2() public view returns (address) {
    return wallet2;
  }

  function getTax() public view returns (uint) {
    return tax;
  }

  function setTax(uint _tax) public onlyTaxEditor {
      require(_tax > 0, "Tax can't must be superior to 0");
      tax = _tax;
  }

  // TransferWithTax
  function transferWithTax() private {
    uint balance = getBalance();
    require(balance > 0, "Balance is 0");
    uint amountForWallet2 = balance * tax / 100;
    uint amountForWallet1 = balance - amountForWallet2;
    // Transfer the tax to Wallet 2
    payable(wallet2).transfer(amountForWallet2);
    // Transfer the rest to Wallet 1
    payable(wallet2).transfer(amountForWallet1);

    emit Tax(wallet1, amountForWallet1, wallet2, amountForWallet2, tax);
  }

  function deposit() public payable{
    payable(address(this)).transfer(msg.value);
    transferWithTax();
  }

  fallback() external payable { 
    payable(address(this)).transfer(msg.value);
    transferWithTax();
  }

  receive() external payable {
      emit Received(msg.sender, msg.value);
      transferWithTax();
  }

}
