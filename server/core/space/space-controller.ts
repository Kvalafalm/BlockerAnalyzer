import spaceServices from './space-services';

class spaceController {
  async getSpaceList(req, res, next) {
    try {
      const result = await spaceServices.getSpaceList();

      await res.status(200).json({
        result: result,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new spaceController();
