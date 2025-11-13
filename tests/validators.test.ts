import { Request, Response, NextFunction } from 'express';
import {
  validateCreateDuty,
  validateUpdateDuty,
  validateIdParam,
} from '../src/validators/duty.validator';
import {
  validateCreateList,
  validateUpdateList,
  validateListIdParam,
} from '../src/validators/list.validator';
import { AppError } from '../src/middlewares';

describe('Duty Validators', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  describe('validateCreateDuty', () => {
    it('should pass validation with valid name', () => {
      mockReq.body = { name: 'Valid Duty Name' };

      validateCreateDuty(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if name is missing', () => {
      expect(() => {
        validateCreateDuty(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error if name is not a string', () => {
      mockReq.body = { name: 123 };

      expect(() => {
        validateCreateDuty(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error if name is empty', () => {
      mockReq.body = { name: '   ' };

      expect(() => {
        validateCreateDuty(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error if name is too long', () => {
      mockReq.body = { name: 'a'.repeat(256) };

      expect(() => {
        validateCreateDuty(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });
  });

  describe('validateUpdateDuty', () => {
    it('should pass validation with valid name', () => {
      mockReq.body = { name: 'Updated Duty Name' };

      validateUpdateDuty(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if name is missing', () => {
      expect(() => {
        validateUpdateDuty(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });
  });

  describe('validateIdParam', () => {
    it('should pass validation with valid UUID', () => {
      mockReq.params = { id: '123e4567-e89b-12d3-a456-426614174000' };

      validateIdParam(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if id is missing', () => {
      expect(() => {
        validateIdParam(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error if id format is invalid', () => {
      mockReq.params = { id: 'invalid-uuid' };

      expect(() => {
        validateIdParam(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);
    });
  });

  describe('List Validators', () => {
    describe('validateCreateList', () => {
      it('should pass validation with valid name', () => {
        mockReq.body = { name: 'Valid List Name' };

        validateCreateList(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
      });

      it('should throw error if name is missing', () => {
        expect(() => {
          validateCreateList(mockReq as Request, mockRes as Response, mockNext);
        }).toThrow(AppError);
      });

      it('should throw error if name is not a string', () => {
        mockReq.body = { name: 123 };

        expect(() => {
          validateCreateList(mockReq as Request, mockRes as Response, mockNext);
        }).toThrow(AppError);
      });

      it('should throw error if name is empty', () => {
        mockReq.body = { name: '   ' };

        expect(() => {
          validateCreateList(mockReq as Request, mockRes as Response, mockNext);
        }).toThrow(AppError);
      });

      it('should throw error if name is too long', () => {
        mockReq.body = { name: 'a'.repeat(256) };

        expect(() => {
          validateCreateList(mockReq as Request, mockRes as Response, mockNext);
        }).toThrow(AppError);
      });
    });

    describe('validateUpdateList', () => {
      it('should pass validation with valid name', () => {
        mockReq.body = { name: 'Updated List Name' };

        validateUpdateList(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
      });

      it('should throw error if name is missing', () => {
        expect(() => {
          validateUpdateList(mockReq as Request, mockRes as Response, mockNext);
        }).toThrow(AppError);
      });
    });

    describe('validateListIdParam', () => {
      it('should pass validation with valid UUID', () => {
        mockReq.params = { id: '123e4567-e89b-12d3-a456-426614174000' };

        validateListIdParam(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
      });

      it('should throw error if id is missing', () => {
        expect(() => {
          validateListIdParam(mockReq as Request, mockRes as Response, mockNext);
        }).toThrow(AppError);
      });

      it('should throw error if id format is invalid', () => {
        mockReq.params = { id: 'invalid-uuid' };

        expect(() => {
          validateListIdParam(mockReq as Request, mockRes as Response, mockNext);
        }).toThrow(AppError);
      });
    });
  });
});
