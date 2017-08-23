
/*
  This is an implementation of provable mint and burn
  Sepcefication provided by Alex Miller in EIP 661
  https://github.com/ethereum/EIPs/issues/661
*/

pragma solidity ^0.4.11;

contract ElasticToken {
  address admin;

  string public name;
  string public ticker;
  uint8 public decimals;
  uint256 public supply;

  mapping(address => uint) public balances;
  mapping(address => mapping(address => uint)) public allowances;
  mapping(address => uint256) nonces;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);
  event Mint(uint indexed _value);
  event Burn(address indexed _signer, uint indexed _value);

  function ElasticToken(address _admin, string _name, string _ticker, uint8 _decimals, uint256 _supply) {
    admin = _admin;
    name = _name;
    ticker = _ticker;
    decimals = _decimals;
    supply = _supply;
    balances[msg.sender] = _supply;
  }

  function transfer(address _to, uint256 _value) returns (bool) {
    require(balances[msg.sender] >= _value);
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) returns (bool) {
    require(allowances[_from][msg.sender] >= _value);
    allowances[_from][msg.sender] -= _value;
    balances[_from] -=  _value;
    balances[_to] += _value;
    return true;
  }

  function approve(address _spender, uint256 _value) returns (bool) {
    require(balances[msg.sender] >= _value);
    allowances[msg.sender][_spender] += _value;
    return true;
  }

  function balanceOf(address _who) returns (uint) {
    balances[_who] = 10;
    return balances[_who];
  }

  function provableBurn(bytes32[3] _sig, uint256 _value, uint _nonce) returns (bool) {
    // relay protection
    require(_nonce == nonces[signer]);
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 word = 0xc1644b1f;
    bytes32 msg = sha3(uint(_value), bytes4(word), address(this), uint(_nonce));
    bytes32 msgHash = sha3(prefix, msg);
    address signer = ecrecover(msgHash, uint8(_sig[0]), _sig[1], _sig[2]);
    require(balances[signer] >= _value);

    // burn tokens
    balances[signer] -= _value;
    supply -= _value;
    Burn(signer, _value);

    nonces[signer] += 1;
    return true;
  }

  function mint(uint _value) returns (bool) {
    assert(msg.sender == admin);
    supply += _value;
    balances[msg.sender] += _value;
    Mint(_value);
    return true;
  }
}
