const { expect } = require("chai");

const testUtil = require("../util/test-util");
const ActionSchema = require("./Action");

describe("ActionSchema", function() {
  it("should throw a validation error when no username property provided", function() {
    // when
    const { error, value } = ActionSchema.validate({});

    // then
    expect(error.message).to.equal('"userId" is required');
    expect(error.name).to.equal("ValidationError");
  });

  it("should throw a validation error when no title provided", function() {
    // given
    const actionObj = testUtil.getRandomActionObj({});
    delete actionObj.title;

    // when
    const { error, value } = ActionSchema.validate(actionObj);

    // then
    expect(error.message).to.equal('"title" is required');
    expect(error.name).to.equal("ValidationError");
  });

  it("should validate when all properties provided", function() {
    // given
    const actionObj = testUtil.getRandomActionObj({});

    // when
    const { error, value } = ActionSchema.validate(actionObj);

    // then
    expect(error).to.be.undefined;
    expect(value).to.deep.equal(actionObj);
  });
});
