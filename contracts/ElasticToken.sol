pragma solidity ^0.4.15;

contract ElasticToken {
  /* EVENTS */
  event ChangeAdmin(address indexed _admin);
  event ChangeDecimal(uint256 _decimal);
  event Transfer(address indexed _to, uint256 _amount);

  /* STATE */
  address admin;
  uint256 supply;
  uint256 decimal;
  string name;
  string ticker;
  mapping(address => uint256) balances;
  mapping(address => mapping(address => uint)) approvals;

  /* CNSTRCTR */
  function ElasticToken(address _admin, uint256 _supply, uint256 _decimal, string _name, string _ticker) {
    admin = _admin;
    supply = _supply;
    decimal = _decimal;
    name = _name;
    ticker = _ticker;
    balances[msg.sender] = _supply;
  }

  /* PUBLIC FNS */
  function transfer(address _to, uint256 _amount) returns (bool) {
    require(balances[msg.sender] >= _amount);
    balances[msg.sender] -= _amount;
    balances[_to] += _amount;
    Transfer(_to, _amount);
  }

  /* SIGNATURE ABSTRACTED FNS */


  /* ADMIN FNS */
  function changeAdmin(address _newAdmin) returns (bool) {
    require(msg.sender == admin);
    admin = _newAdmin;
    return true;
  }

  function changeDecimal(uint256 _newDecimal) returns (bool) {
    require(msg.sender == admin);
    decimal = _newDecimal;
    return true;
  }

  /* SAFE MATH */
}
