import { EDTag, SDTag } from './ImportData-constans.js';
import moment from 'moment';
import { Console } from 'console';

const getFlagFromChangelog = (BlockerObj, changeLog) => {
  const tableOfFlags = getArrayOfFlaged(changeLog);
  for (const bloker of BlockerObj) {
    if (!bloker.end) {
      for (const row of tableOfFlags) {
        if (bloker.start.isBetween(row.start, row.end) && !bloker.end) {
          bloker.end = row.end;
          bloker.comments = 'End date from flagoff';
        }
      }
    }
  }
};

const addBlockersFromChangeLog = (BlockerObj, changeLog, emptyBlocker) => {
  const tableOfFlags = getArrayOfFlaged(changeLog);
  for (const row of tableOfFlags) {
    for (const blocker of BlockerObj) {
      let end;
      if (blocker.end) {
        end = moment(blocker?.end?.format('YYYY-MM-DD'));
      } else {
        end = moment();
      }

      const start = moment(blocker.start.format('YYYY-MM-DD'));
      if (row.start.isBetween(start.startOf('day'), end.endOf('day'))) {
        row.skip = end.diff(blocker.start, 'hours') > 1;
      }
    }

    if (!row.skip) {
      const newBlocker = { ...emptyBlocker };
      newBlocker.start = row.start;
      newBlocker.end = row.end;
      newBlocker.tags = ['empty'];
      newBlocker.reason = 'Blocker from changelog';
      BlockerObj.push(newBlocker);
    }
  }
};

const getStatusFromChangelog = (BlockerObj, changeLog, FirstRow) => {

  const tableOfStatus = getArrayOfStatus(changeLog, FirstRow);

  for (const bloker of BlockerObj) {
    for (const row of tableOfStatus) {
      let end = row.end;
      if (!end) {
        end = moment();
      }

      if (bloker.start.isBetween(row.start, end)) {
        bloker.status = row.value;
      }
    }
  }
};

const inputEndDateByEndStatustTime = (BlockerObj, changeLog, createdTime) => {
  const tableOfStatus = getArrayOfStatus(changeLog, createdTime);
  for (const bloker of BlockerObj) {
    for (const row of tableOfStatus) {
      let end = row.end;
      if (!end) {
        end = moment();
      }
      if (bloker.start.isBetween(row.start, end) && !bloker.end) {
        bloker.end = row.end;
        if (row.end) {
          bloker.comments = 'End date when changed status';
        }
      }
    }
  }
};

const getArrayOfFlaged = changeLog => {
  const newArray = [];
  if (!Array.isArray(changeLog)) {
    return null;
  }
  let row;
  let firstElement = true;
  let pushFinalRow = true;

  for (const item of changeLog) {
    for (const itemField of item.items) {
      if (itemField?.field?.toLowerCase() === 'flagged') {
        if (itemField.toString) {
          row = {
            value: itemField.toString,
            start: moment(item.created),
            end: '',
          };
          pushFinalRow = true;
        } else if (row?.start) {
          row.end = moment(item.created);
          newArray.push({ ...row });
          pushFinalRow = false;
        }
      }
    }
  }
  if (row) {
    newArray.push(row);
  }
  return newArray;
};

const getArrayOfStatus = (changeLog, FirstRow) => {
  const newArray = [];
  if (!Array.isArray(changeLog)) {
    return null;
  }

  let row = { ...FirstRow };
  let firstElement = true;
  let pushFinalRow = true;

  for (const item of changeLog) {
    for (const itemField of item.items) {
      if (itemField.field.toLowerCase() === 'status') {
        if (firstElement) {

          newArray.push({
            value: itemField.fromString,
            valueId: itemField.from,
            start: FirstRow.start,
            end:moment(item.created)
          });

          row = {
            value: itemField.toString,
            valueId: itemField.to,
            start: moment(item.created)
          };
          firstElement = false;
        }

        if (row?.value !== itemField.toString) {
          if (row) {
            row.end = moment(item.created);
            newArray.push({ ...row });
            pushFinalRow = false;
            if (itemField.toString) {
              row = {
                value: itemField.toString,
                valueId: itemField.to,
                start: moment(item.created),
                end: undefined,
              };
              pushFinalRow = true;
            }
          }
        }
      }
    }
  }
  if (pushFinalRow) {
    if (row.end && row.valueId === 6) {
      row.end = row.start;
    }
    newArray.push(row);
  }
  return newArray;
};

const commentsProcess = (comments, issue) => {
  const rows = [];
  let expectedStartBloker = true;
  let row = {
    ...issue,
    idBloker: '',
    start: '',
    end: '',
    time: '',
    decision: '',
    tags: [],
  };
  let ArrayData = comments;

  if (!Array.isArray(ArrayData)) {
    ArrayData = [];
    ArrayData.push(comments);
  }

  let SaveFinalBloker = false;

  ArrayData.forEach(coment => {
    const text = prepereText(coment.body);

    if (
      haveStringEndBlokerComment(text) &&
      haveStringStartBlokerComment(text)
    ) {
    } else if (haveStringEndBlokerComment(text)) {
      // ФлагСерый Сняли блокировку добавлен
      if (!expectedStartBloker) {
        let endDate = new Date(coment.created);
        if (text.indexOf(EDTag) > 0) {
          endDate = new Date(
            text.substring(
              text.indexOf(EDTag) + EDTag.length,
              text.indexOf(EDTag) + 10 + EDTag.length
            )
          );
        }
        if (row.end == undefined) {
          row.end = moment(endDate);
        }
        row.decision = cutTheText(text, extractTagsFromText(text));
        expectedStartBloker = true;
        rows.push(row);
        SaveFinalBloker = false;
      }
    } else if (haveStringStartBlokerComment(text)) {
      let startDate = new Date(coment.created);

      let endDate = undefined;
      if (text.indexOf(EDTag) > 0) {
        endDate = new Date(
          text.substring(
            text.indexOf(EDTag) + EDTag.length,
            text.indexOf(EDTag) + 10 + EDTag.length
          )
        );
      }
      if (text.indexOf(SDTag) > 0) {
        startDate = new Date(
          text.substring(
            text.indexOf(SDTag) + SDTag.length,
            text.indexOf(SDTag) + 10 + SDTag.length
          )
        );
      }
      // ФлагКрасный Поставили блокировку добавлен
      if (expectedStartBloker) {
        row = {
          ...issue,
          idBloker: coment.id,
          start: startDate ? moment(startDate) : null,
          end: endDate ? moment(endDate) : null,
          reason: cutTheText(text, extractTagsFromText(text)),
          tags: extractTagsFromText(text),
        };
        expectedStartBloker = false;
        SaveFinalBloker = true;
      } else {
        rows.push(row);
        row = {
          ...issue,
          idBloker: coment.id,
          start: startDate ? moment(startDate) : null,
          end: endDate ? moment(endDate) : null,
          reason: cutTheText(text, extractTagsFromText(text)),
          tags: extractTagsFromText(text),
        };
        SaveFinalBloker = true;
      }
    }
  });

  if (SaveFinalBloker) {
    rows.push(row);
  }
  return rows;
};

const extractTagsFromText = text => {
  const tags = [];
  const search = ' '.concat(text).split('#');
  if (text.indexOf('#') > 0) {
    let firstElement = true;
    search.forEach(element => {
      if (firstElement) {
        firstElement = false;
      } else {
        const searchPosEmpty =
          element.indexOf(' ') > 0 ? element.indexOf(' ') : 999999999;
        const searchPosNew =
          element.indexOf('\n') > 0 ? element.indexOf('\n') : 999999999;
        const searchPosMinus =
          element.indexOf('-') > 0 ? element.indexOf('-') : 999999999;
        const searchPosEnd = element.length < 20 ? element.length : 20;
        const min = Math.min(
          searchPosEmpty,
          searchPosNew,
          searchPosEnd,
          searchPosMinus
        );
        min
          ? tags.push(
            element.substring(0, min).replaceAll(' ', '').toLowerCase()
          )
          : '';
      }
    });
  } else {
    tags.push('empty');
  }

  return tags;
};

const haveStringEndBlokerComment = String => {
  if (
    String.indexOf('/images/icons/emoticons/flag_grey.png') >= 0 ||
    String.indexOf('(flagoff)') >= 0
  ) {
    return true;
  }
  return false;
};

const haveStringStartBlokerComment = String => {
  if (
    String.indexOf('/images/icons/emoticons/flag.png') >= 0 ||
    String.indexOf('Добавлен флаг:') >= 0 ||
    String.indexOf('Flag added') >= 0 ||
    String.indexOf('(flag)') >= 0
  ) {
    return true;
  }
  return false;
};

const cutTheText = (text, tags) => {
  let newText = text
    .replaceAll("/images/icons/emoticons/flag.png'", '')
    .replaceAll('Флажок добавлен', '')
    .replaceAll('Добавлен флаг', '')
    .replaceAll('Flag added', '')
    .replaceAll('(flag)', '')
    .replaceAll('(flagoff) Флажок снят', '')
    .replaceAll('(flagoff) Flag removed', '');

  tags &&
    tags.forEach(element => {
      newText = newText.replaceAll('#' + element, '');
    });

  return newText;
};

const prepereText = body => {
  return body
    .replaceAll('[b]', '<b>')
    .replaceAll('[/b]', '</b>')
    .replaceAll('[p]', '<p>')
    .replaceAll('[/p]', '</p>')
    .replaceAll(`\\`, ` \\`)
    .replaceAll('\r', ' \r')
    .replaceAll('# ', '* ')
    .replaceAll('\r\n', '')
    .replaceAll('\n\n', '\n')
    .replaceAll('&#38;', '&')
    .replaceAll('&#39;', `'`)
    .replaceAll('&#34;', '"')
    .replaceAll('&#', '')
    .replaceAll(' ', '')
    .replace(/<\/?[^>]+(>|$)/g, '');
};
export {
  getFlagFromChangelog,
  getStatusFromChangelog,
  inputEndDateByEndStatustTime,
  commentsProcess,
  addBlockersFromChangeLog,
  getArrayOfStatus,
};
