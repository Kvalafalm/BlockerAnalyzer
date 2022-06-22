import BlockerModel from './Blocker-model.js';
import BlockerView from './Blocker-view.js';
class BlockerServices {
  async getBlockersList() {
    const documents = await BlockerModel.find();
    const BlockersView = await BlockerView.prepareArrayOfBlockers(documents);
    return BlockersView;
  }

  async getBlockersListById(id) {
    const documents = await BlockerModel.find({ idIssue: id });
    return documents;
  }

  async clearBlockerByIdIssue(id) {
    const { deletedCount } = await BlockerModel.deleteMany({ idIssue: id.toString() });
    return deletedCount;
  }

  async setBlocker(body) {
    const document = new BlockerModel({ ...body });
    await document.save();
    return document;
  }

  async updateBlocker(id, body) {
    let query = { idBloker: id };
    if (!id) {
      query = { idIssue: body.idIssue, start: body.start };
    }
    let document = await BlockerModel.findOneAndUpdate(query, { ...body });
    if (!document) {
      const blocker = await new BlockerModel({ ...body });
      await blocker.save();
      document = await blocker;
    }
    return document;
  }
}

export default new BlockerServices();
