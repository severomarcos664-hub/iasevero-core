import {
  planRuntimeTask,
} from '../app/lib/runtime-core/runtime-task-planner'

const plan = planRuntimeTask(
  'criar comandos profissionais para integrar execution intelligence na IASevero',
)

console.log('\n=== IASEVERO RUNTIME TASK PLANNER ===\n')
console.log(plan)
