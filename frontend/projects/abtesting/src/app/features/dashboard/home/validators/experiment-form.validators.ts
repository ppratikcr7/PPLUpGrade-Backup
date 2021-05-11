import { AbstractControl } from '@angular/forms';
import {
  POST_EXPERIMENT_RULE,
  EXPERIMENT_STATE
} from '../../../../core/experiments/store/experiments.model';

export class ExperimentFormValidators {

  static validateExperimentDesignForm(controls: AbstractControl): { [key: string]: any } | null {
    const conditions = controls.get('conditions').value;
    if (conditions.length >= 0) {
      if(conditions.length == 0) {
        return { assignmentWeightsSumError: false };
      } else if (conditions.length >= 1) {
        const conditionWeight = conditions.map(condition => condition.assignmentWeight);
        if(!conditionWeight[0]) {
          return { assignmentWeightsSumError: false };
        } else {
          // handling sum of decimal values for assignment weights:
          let sumOfAssignmentWeights = 0.0;
          conditions.forEach(condition => (sumOfAssignmentWeights += parseFloat(condition.assignmentWeight)));
          // checking if sum is not equal to 100
          return Math.ceil(sumOfAssignmentWeights) !== 100.0 ? { assignmentWightsSumError: true } : null;
        }
      }
    }
    return null;
  }

  static validatePostExperimentRuleForm(controls: AbstractControl): { [key: string]: any } | null {
    const postExperimentRule = controls.get('postExperimentRule').value;
    const revertTo = controls.get('revertTo').value;
    if (postExperimentRule === POST_EXPERIMENT_RULE.ASSIGN && !revertTo) {
      return { conditionSelectionError: true };
    }
    return null;
  }

  static validateExperimentStatusForm(controls: AbstractControl): { [key: string]: any } | null {
    const newStatusValue = controls.get('newStatus').value;
    const scheduleDate = controls.get('scheduleDate').value;
    if (newStatusValue.value === EXPERIMENT_STATE.SCHEDULED && !scheduleDate) {
      return { scheduleDateError: true };
    }
    return null;
  }
}
