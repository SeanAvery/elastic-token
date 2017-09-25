pragma solidity ^0.4.15;

contract ElasticToken {
  /* STATE */
  address admin;

  /* Constructor */
  function ElasticToken(address _admin) {
    admin = _admin;
  }

  /* PUBLIC FNS */

  /* SIGNATRE ABSTRACTED FNS */

  /* ADMIN FNS */
  function changeAdmin(address _newAdmin) returns (bool) {
    require(msg.sender == admin);
    admin = _newAdmin;
    return true;
  }

  /* SAFE MATH */
}
