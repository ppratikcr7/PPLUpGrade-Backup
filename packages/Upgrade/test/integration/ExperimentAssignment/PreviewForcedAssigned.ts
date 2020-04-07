import { Container } from 'typedi';
import { individualAssignmentExperiment } from '../mockData/experiment';
import { ExperimentService } from '../../../src/api/services/ExperimentService';
import { EXPERIMENT_STATE } from 'ees_types';
import { Logger as WinstonLogger } from '../../../src/lib/logger';
import { getAllExperimentCondition, markExperimentPoint } from '../utils';
import { UserService } from '../../../src/api/services/UserService';
import { systemUser } from '../mockData/user/index';
import { previewUsers } from '../mockData/previewUsers/index';
import { PreviewUserService } from '../../../src/api/services/PreviewUserService';
import {
  checkExperimentAssignedIsNotDefault,
  checkExperimentAssignedIsDefault,
  checkMarkExperimentPointForUser,
} from '../utils/index';

export default async function testCase(): Promise<void> {
  const logger = new WinstonLogger(__filename);
  const experimentService = Container.get<ExperimentService>(ExperimentService);
  const userService = Container.get<UserService>(UserService);
  const previewService = Container.get<PreviewUserService>(PreviewUserService);

  // creating new user
  const user = await userService.create(systemUser as any);

  // create preview user
  await previewService.create(previewUsers[0]);
  await previewService.create(previewUsers[1]);
  await previewService.create(previewUsers[2]);
  await previewService.create(previewUsers[3]);

  // experiment object
  const experimentObject = individualAssignmentExperiment;

  // create experiment
  await experimentService.create(experimentObject as any, user);
  let experiments = await experimentService.find();
  expect(experiments).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: experimentObject.name,
        state: experimentObject.state,
        postExperimentRule: experimentObject.postExperimentRule,
        assignmentUnit: experimentObject.assignmentUnit,
        consistencyRule: experimentObject.consistencyRule,
      }),
    ])
  );

  const experimentName = experimentObject.partitions[0].name;
  const experimentPoint = experimentObject.partitions[0].point;

  // get all experiment condition for user 1
  let experimentConditionAssignments = await getAllExperimentCondition(previewUsers[0].id);
  expect(experimentConditionAssignments).toHaveLength(0);

  // mark experiment point
  let markedExperimentPoint = await markExperimentPoint(previewUsers[0].id, experimentName, experimentPoint);
  checkMarkExperimentPointForUser(markedExperimentPoint, previewUsers[0].id, experimentName, experimentPoint);

  // change experiment status to PREVIEW
  const experimentId = experiments[0].id;
  await experimentService.updateState(experimentId, EXPERIMENT_STATE.PREVIEW, user);

  // fetch experiment
  experiments = await experimentService.find();
  expect(experiments).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: experimentObject.name,
        state: EXPERIMENT_STATE.PREVIEW,
        postExperimentRule: experimentObject.postExperimentRule,
        assignmentUnit: experimentObject.assignmentUnit,
        consistencyRule: experimentObject.consistencyRule,
      }),
    ])
  );

  // get preview user
  let previewUser1 = await previewService.findOne(previewUsers[0].id);
  let previewUser2 = await previewService.findOne(previewUsers[1].id);
  expect((previewUser1.assignments && previewUser1.assignments.length) || 0).toEqual(0);

  const assignedConditionUser1 = experiments[0].conditions[0];

  // add forced assignment for preview user 1
  await previewService.upsertExperimentConditionAssignment({
    ...previewUser1,
    assignments: [
      {
        experiment: { id: experimentId },
        experimentCondition: { id: assignedConditionUser1.id },
      },
    ],
  } as any);

  previewUser1 = await previewService.findOne(previewUsers[0].id);
  expect((previewUser1.assignments && previewUser1.assignments.length) || 0).toEqual(1);

  // get all experiment condition for user 2
  experimentConditionAssignments = await getAllExperimentCondition(previewUsers[1].id);
  checkExperimentAssignedIsNotDefault(experimentConditionAssignments, experimentName, experimentPoint);

  // mark experiment point for user 2
  markedExperimentPoint = await markExperimentPoint(previewUsers[1].id, experimentName, experimentPoint);
  checkMarkExperimentPointForUser(markedExperimentPoint, previewUsers[1].id, experimentName, experimentPoint);

  // get all experiment condition for user 1
  experimentConditionAssignments = await getAllExperimentCondition(previewUsers[0].id);
  checkExperimentAssignedIsNotDefault(experimentConditionAssignments, experimentName, experimentPoint);

  // mark experiment point for user 1
  markedExperimentPoint = await markExperimentPoint(previewUsers[0].id, experimentName, experimentPoint);
  checkMarkExperimentPointForUser(markedExperimentPoint, previewUsers[0].id, experimentName, experimentPoint);

  // check assignment is the one assigned
  expect(experimentConditionAssignments[0].assignedCondition.conditionCode).toEqual(
    assignedConditionUser1.conditionCode
  );

  const assignedConditionUser2 = experiments[0].conditions[1];

  // add forced assignment for preview user 1
  await previewService.upsertExperimentConditionAssignment({
    ...previewUser2,
    assignments: [
      {
        experiment: { id: experimentId },
        experimentCondition: { id: assignedConditionUser2.id },
      },
    ],
  } as any);

  previewUser2 = await previewService.findOne(previewUsers[1].id);
  expect((previewUser2.assignments && previewUser2.assignments.length) || 0).toEqual(1);

  // get all experiment condition for user 3
  experimentConditionAssignments = await getAllExperimentCondition(previewUsers[2].id);
  checkExperimentAssignedIsNotDefault(experimentConditionAssignments, experimentName, experimentPoint);

  // mark experiment point for user 1
  markedExperimentPoint = await markExperimentPoint(previewUsers[2].id, experimentName, experimentPoint);
  checkMarkExperimentPointForUser(markedExperimentPoint, previewUsers[2].id, experimentName, experimentPoint);

  await experimentService.updateState(experimentId, EXPERIMENT_STATE.ENROLLING, user);

  // fetch experiment
  experiments = await experimentService.find();
  expect(experiments).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: experimentObject.name,
        state: EXPERIMENT_STATE.ENROLLING,
        postExperimentRule: experimentObject.postExperimentRule,
        assignmentUnit: experimentObject.assignmentUnit,
        consistencyRule: experimentObject.consistencyRule,
      }),
    ])
  );

  // get all experiment condition for user 2
  experimentConditionAssignments = await getAllExperimentCondition(previewUsers[1].id);
  checkExperimentAssignedIsNotDefault(experimentConditionAssignments, experimentName, experimentPoint);

  // mark experiment point for user 2
  markedExperimentPoint = await markExperimentPoint(previewUsers[1].id, experimentName, experimentPoint);
  checkMarkExperimentPointForUser(markedExperimentPoint, previewUsers[1].id, experimentName, experimentPoint);

  // add forced assignment for preview user 1
  await previewService.upsertExperimentConditionAssignment({
    ...previewUser1,
    assignments: [],
  } as any);

  previewUser1 = await previewService.findOne(previewUsers[0].id);
  expect((previewUser1.assignments && previewUser1.assignments.length) || 0).toEqual(0);

  // get all experiment condition for user 1
  experimentConditionAssignments = await getAllExperimentCondition(previewUsers[0].id);
  checkExperimentAssignedIsDefault(experimentConditionAssignments, experimentName, experimentPoint);

  // mark experiment point for user 1
  markedExperimentPoint = await markExperimentPoint(previewUsers[0].id, experimentName, experimentPoint);
  checkMarkExperimentPointForUser(markedExperimentPoint, previewUsers[0].id, experimentName, experimentPoint);

  // get all experiment condition for user 3
  experimentConditionAssignments = await getAllExperimentCondition(previewUsers[2].id);
  checkExperimentAssignedIsNotDefault(experimentConditionAssignments, experimentName, experimentPoint);

  // mark experiment point for user 1
  markedExperimentPoint = await markExperimentPoint(previewUsers[2].id, experimentName, experimentPoint);
  checkMarkExperimentPointForUser(markedExperimentPoint, previewUsers[2].id, experimentName, experimentPoint);
}
