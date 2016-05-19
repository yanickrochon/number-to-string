
describe('Test toWords', function () {
  'use strict';

  const Converter = require('../index');


  it('should convert units', function () {
    let converter = new Converter();

    converter.toWords(0).should.equal('zero');
    converter.toWords(1).should.equal('one');
    converter.toWords(2).should.equal('two');
    converter.toWords(3).should.equal('three');
    converter.toWords(4).should.equal('four');
    converter.toWords(5).should.equal('five');
    converter.toWords(6).should.equal('six');
    converter.toWords(7).should.equal('seven');
    converter.toWords(8).should.equal('eight');
    converter.toWords(9).should.equal('nine');
  });

  it('should convert tens', function () {
    let converter = new Converter();

    converter.toWords(10).should.equal('ten');
    converter.toWords(11).should.equal('eleven');
    converter.toWords(12).should.equal('twelve');
    converter.toWords(13).should.equal('thirteen');
    converter.toWords(14).should.equal('fourteen');
    converter.toWords(15).should.equal('fifteen');
    converter.toWords(16).should.equal('sixteen');
    converter.toWords(17).should.equal('seventeen');
    converter.toWords(18).should.equal('eighteen');
    converter.toWords(19).should.equal('nineteen');
  });

  it('should convert tens over twenty', function () {
    let converter = new Converter();

    converter.toWords(20).should.equal('twenty');
    converter.toWords(22).should.equal('twenty-two');
    converter.toWords(30).should.equal('thirty');
    converter.toWords(37).should.equal('thirty-seven');

  });


  it('should convert big integers', function () {
    let converter = new Converter();

    converter.toWords(99999999).should.equal('ninety-nine million nine hundred ninety-nine thousand nine hundred ninety-nine');



  });


});