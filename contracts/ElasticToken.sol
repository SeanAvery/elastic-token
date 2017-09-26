pragma solidity ^0.4.15;

contract ElasticToken {
  /* EVENTS */
  event Transfer(address indexed _to, uint256 _amount);
  event Approve(address indexed _from, address indexed _spender, uint256 _amount);
  event Burn(address indexed _from, uint256 _amount);
  event Mint(address indexed _beneficiary, uint256 _amount);
  event ChangeAdmin(address indexed _admin);
  event ChangeDecimal(uint256 _decimal);

  /* STATE */
  address public admin;
  uint256 public supply;
  uint256 public decimal;
  string public name;
  string public ticker;
  mapping(address => uint256) public balances;
  mapping(address => mapping(address => uint256)) public approvals;
  mapping(address => uint) public burnings;
  mapping(bytes32 => bool) public fills;

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
    return true;
  }

  function approve(address _spender, uint256 _amount) returns (bool) {
    require(balances[msg.sender] >= _amount);
    approvals[msg.sender][_spender] = _amount;
    Approve(msg.sender, _spender, _amount);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _amount) returns (bool) {
    require(balances[_from] >= _amount);
    require(approvals[_from][msg.sender] >= _amount);
    approvals[_from][msg.sender] -= _amount;
    balances[_from] -= _amount;
    balances[_to] += _amount;
    Transfer(_from, _amount);
    return true;
  }

  function burn(uint256 _amount) returns (bool) {
    require(balances[msg.sender] >= _amount);
    balances[msg.sender] -= _amount;
    burnings[msg.sender] += _amount;
    supply -= _amount;
    Burn(msg.sender, _amount);
    return true;
  }

  /* SIGNATURE ABSTRACTED FNS */
  function burn(uint256 _amount, bytes32 _salt, address _who, bytes32[3] _sig) returns (bool) {
    bytes4 methodID = 0xc1644b1f;
    bytes32 msgHash = keccak256(methodID, _amount, _salt);
    address signer = ecrecover(msgHash, uint8(_sig[2]), _sig[0], _sig[1]);
    require(signer == _who);
    require(fills[msgHash] == false);
    balances[signer] -= _amount;
    supply -= _amount;
    burnings[signer] += _amount;
    fills[msgHash] = true;
    Burn(signer, _amount);
    return true;
  }

  /* ADMIN FNS */
  function mint(uint256 _amount, address _beneficiary) returns (bool) {
    require(msg.sender == admin);
    supply+= _amount;
    balances[_beneficiary] += _amount;
    Mint(_beneficiary, _amount);
    return true;
  }

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
