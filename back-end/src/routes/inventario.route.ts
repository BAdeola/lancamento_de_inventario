// src/routes.ts
import { Router } from 'express';
import { InventarioController } from '../controllers/inventario.controller';

const router = Router();
const controller = new InventarioController();

// Rota para carregar os grupos e itens (O que alimenta a tela inicial)
// Exemplo: GET /api/inventario?data=2025-05-20
router.get('/inventario', (req, res) => controller.getDadosParaConferencia(req, res));

// Rota para salvar cada item conferido
router.post('/inventario/gravar', (req, res) => controller.salvarItem(req, res));

export default router;