/**
 * Created by Tõnis Kasekamp on 18.12.2017.
 */
import {CLASSIFICATION, REGRESSION} from '../reference';


export const jobToValidationTable = (job) => {
  const kmeans = job.config.kmeans;
  if (job.type === REGRESSION) {
    return {
      id: job.id,
      type: job.type,
      encoding: job.config.encoding,
      clustering: job.config.clustering,
      method: job.config.method,
      splitName: '',
      prefix_length: job.config.prefix_length,
      padding: job.config.padding,
      hyperopt: job.config.hyperopt,
      label: job.config.label,
      kmeans,
      create_models: job.config.create_models,
      advanced: job.config[`${REGRESSION}.${job.config.method}`]
    };
  } else if (job.type === CLASSIFICATION) {
    return {
      id: job.id,
      type: job.type,
      encoding: job.config.encoding,
      clustering: job.config.clustering,
      method: job.config.method,
      splitName: '',
      prefix_length: job.config.prefix_length,
      padding: job.config.padding,
      hyperopt: job.config.hyperopt,
      label: job.config.label,
      create_models: job.config.create_models,
      kmeans,
      advanced: job.config[`${job.type}.${job.config.method}`]
    };
  } else {
    return {
      id: job.id,
      encoding: job.config.encoding,
      splitName: '',
      prefix_length: job.config.prefix_length,
      padding: job.config.padding,
      label: job.config.label,
      result: job.result
    };
  }
};

export const toRun = (job) => {
  return `${job.config.method}_${job.config.encoding}_${job.config.clustering}`;
};

const toLineObject = (job, metricName) => {
  const metric = job.result[metricName];
  return {run: toRun(job), prefix_length: job.config.prefix_length, metric};
};

const uniqEs6 = (arrArg) => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) === pos;
  });
};

const uniqueJobRuns = (lineObjects) => {
  const runs = lineObjects.map((ob) => ob.run);
  return uniqEs6(runs);
};

const uniquePrefixes = (lineObjects) => {
  const runs = lineObjects.map((ob) => ob.prefix_length);
  return uniqEs6(runs);
};

const makeEmptyPrefixRows = (uniqPrefs, columnSize) => {
  return uniqPrefs.map((u) => [u, ...Array.from({length: columnSize}, (_) => null)]);
};

const compareByPrefix = (a, b) => {
  if (a.prefix_length > b.prefix_length) {
    return -1;
  }
  if (a.prefix_length < b.prefix_length) {
    return 1;
  }
  return 0;
};

export const makeTable = (jobs, metricName) => {
  const lineObjects = jobs.map((job) => toLineObject(job, metricName));
  lineObjects.sort(compareByPrefix);
  const uniqueRuns = uniqueJobRuns(lineObjects);
  const header = ['Prefix length', ...uniqueRuns];
  const uniquePrefs = uniquePrefixes(lineObjects);
  const prefixRows = makeEmptyPrefixRows(uniquePrefs, uniqueRuns.length);
  // empty shell ready
  let dataTable = [header, ...prefixRows];

  for (let ob of lineObjects) {
    const column = dataTable[0].findIndex((el) => el === ob.run);
    const row = uniquePrefs.findIndex((el) => el === ob.prefix_length) + 1;
    dataTable[row][column] = ob.metric;
  }
  return dataTable;
};

export const makeLabels = (jobs) => {
  if (jobs.length === 0) {
    return [];
  }
  return Object.keys(jobs[0].result).map((metric) => {
    return {label: metric, value: metric};
  });
};
