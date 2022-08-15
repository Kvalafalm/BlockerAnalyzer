import moment from 'moment';
import BlockerServices from '../bloker/Blocker-services';
import ImportDataServices from '../ImportData/ImportData-services';
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
  async createSpace(req, res, next) {

    try {
      const { externalId } = req.body
      let result
      const createSpace = await spaceServices.updateOrCreateSpace(externalId, req.body);
      /*       if (createSpace) {
              result = await ImportDataServices.ImportIssuesFromKanbanBoard(
                externalId,
                moment("2020-01-01"),
                moment(),
                true
              );
              await res.status(200).json({
                result: result,
              });
            } else { */
      await res.status(200).json({
        result: result
      });
      /*  } */

    } catch (e) {
      next(e);
    }
  }

  async deleteSpace(req, res, next) {

    try {
      const { id } = req.params
      const result = await spaceServices.deleteSpace(id);
      const resultBlockers = await BlockerServices.deleteBlockersByIdSapce(id);
      await res.status(200).json({
        result: result,
        deletedCount: resultBlockers.deletedCount
      });

    } catch (e) {
      next(e);
    }
  }
}

export default new spaceController();
